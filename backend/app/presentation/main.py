from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.config import ASSETS_DIR, FRONTEND_DIST_DIR, get_settings
from app.presentation.errors import registrar_handlers_de_erro
from app.presentation.rate_limit import limiter
from app.presentation.routes.etiqueta_routes import router as etiqueta_router
from app.presentation.routes.orcamento_routes import router as orcamento_router

settings = get_settings()

app = FastAPI(title="Etiquetas SEDEX BWR", version="1.0.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

registrar_handlers_de_erro(app)

app.mount("/static", StaticFiles(directory=str(ASSETS_DIR)), name="static")

app.include_router(orcamento_router)
app.include_router(etiqueta_router)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


# Em produção, o build do frontend (frontend/dist) é servido pelo próprio
# backend, num único processo — sem precisar de um servidor web separado.
# Em desenvolvimento essa pasta não existe (usa-se `npm run dev` com proxy
# do Vite), então o mount só acontece se ela estiver presente.
if FRONTEND_DIST_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST_DIR), html=True), name="frontend")
