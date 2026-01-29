from fastapi import APIRouter, Depends, Form, HTTPException, status, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from typing import Annotated, Optional, Dict, Any
import os

import backend.db.database as db_module
from backend.auth.auth_utils import hash_password, verify_password, create_access_token
from backend.dependencies import get_current_user

auth_templates = Jinja2Templates(directory="auth")

router = APIRouter(tags=["Authentication"])

# В продакшене куки должны быть только по HTTPS.
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "").lower() == "true"

# ------------------------------
#  ЕДИНАЯ СТРАНИЦА АВТОРИЗАЦИИ
# ------------------------------
@router.get("/auth_page", response_class=HTMLResponse, summary="Единая страница входа и регистрации")
async def get_auth_page(
    request: Request,
    tab: Optional[str] = "register",
    error_message: Optional[str] = None,
    success_message: Optional[str] = None
):
    """
    Показывает страницу с формами регистрации и входа (в одной HTML-странице).
    Если пользователь уже авторизован (есть валидная кука access_token),
    сразу перенаправляем его в чаты.
    """
    # Если в браузере уже есть валидная кука access_token — отправляем в чаты
    try:
        current_user = await get_current_user(request)
        if current_user:
            return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)
    except Exception:
        # Любые ошибки проверки токена игнорируем и просто показываем страницу логина/регистрации
        pass

    return auth_templates.TemplateResponse("auth.html", {
        "request": request,
        "tab": tab,  # активная вкладка
        "error_message": error_message,
        "success_message": success_message
    })


# ------------------------------
#  РЕГИСТРАЦИЯ
# ------------------------------
@router.post("/register", response_class=HTMLResponse, summary="Обработка регистрации нового пользователя")
async def register_user_from_form(
    request: Request,
    username: Annotated[str, Form()],
    email: Annotated[str, Form()],
    password: Annotated[str, Form()]
):
    users_collection = db_module.get_users_collection()

    existing_user_by_email: Optional[Dict[str, Any]] = await users_collection.find_one({"email": email})
    if existing_user_by_email:
        return auth_templates.TemplateResponse("auth.html", {
            "request": request,
            "tab": "register",
            "error_message": "Пользователь с таким email уже зарегистрирован."
        }, status_code=status.HTTP_409_CONFLICT)

    existing_user_by_username: Optional[Dict[str, Any]] = await users_collection.find_one({"username": username})
    if existing_user_by_username:
        return auth_templates.TemplateResponse("auth.html", {
            "request": request,
            "tab": "register",
            "error_message": "Пользователь с таким никнеймом уже существует."
        }, status_code=status.HTTP_409_CONFLICT)

    hashed_password = hash_password(password)
    user_document = {
        "username": username,
        "email": email,
        "hashed_password": hashed_password,
        "first_name": None,
        "last_name": None,
        "language": None,
        "about": None,
        "full_name": username,
        "profile_picture": None,
        # Список контактов пользователя (email + отображаемое имя)
        "contacts": []
    }

    try:
        await users_collection.insert_one(user_document)
        # Успешная регистрация → сразу авторизуем пользователя и ставим куку, чтобы он попадал в чаты
        access_token = create_access_token(data={"sub": email, "username": username})
        response = RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            samesite="Lax",
            secure=COOKIE_SECURE,
            path="/",
            max_age=365 * 24 * 60 * 60,  # 365 дней в секундах (1 год, как в Telegram)
        )
        # Не логируем даже часть токена, чтобы не светить его в логах
        return response
    except Exception as e:
        print(f"Ошибка при сохранении пользователя: {e}") 
        return auth_templates.TemplateResponse("auth.html", {
            "request": request,
            "tab": "register",
            "error_message": "Ошибка при сохранении пользователя."
        }, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------------------------
#  ВХОД
# ------------------------------
@router.post("/login", response_class=HTMLResponse, summary="Обработка входа пользователя")
async def login_user_from_form(
    request: Request,
    email: Annotated[str, Form()],
    password: Annotated[str, Form()]
):
    users_collection = db_module.get_users_collection()

    user_data: Optional[Dict[str, Any]] = await users_collection.find_one({"email": email})

    if not user_data or not verify_password(password, user_data["hashed_password"]):
        return auth_templates.TemplateResponse("auth.html", {
            "request": request,
            "tab": "login",
            "error_message": "Неправильный email или пароль."
        }, status_code=status.HTTP_401_UNAUTHORIZED)

    access_token = create_access_token(data={"sub": user_data["email"], "username": user_data["username"]})
    response = RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="Lax",
        secure=COOKIE_SECURE,
        path="/",
        max_age=365 * 24 * 60 * 60,  # 365 дней в секундах (1 год, как в Telegram) - соответствует времени жизни JWT токена
    )
    return response


# ------------------------------
#  ВЫХОД
# ------------------------------
@router.get("/logout", summary="Выход пользователя")
async def logout_user():
    response = RedirectResponse(url="/auth_page?tab=login", status_code=status.HTTP_303_SEE_OTHER)
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="Lax",
        secure=COOKIE_SECURE,
    )
    return response