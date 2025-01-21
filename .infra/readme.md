# Continous Deployment
El pipeline cicd corre el playbook `.infra/.ansible/docker_remote_lauch.yml` que copia los archivos `docker-compose.yml` y `.env` (generado en el pipeline). Para luego levantar el servicio con `docker compose up -d`


# Target servers

En el archivo `.infra/hosts`se definen los servidores para desplegar en los ambientes `dev` y `prod`

# Config & Secrets
El contenido del archivo `.env` que se despliega se genera a partir de los archivos `.infra/.env_dev` y `.infra/.env_prod` (según corresponda) y reemplazando los secretos de producción (`inject_secrets.sh`), keywords con el prefijo `SECRET_`

Estos archivos de configuración dejan un registro de la Infrastructura como Codigo, y los secretos se separan e inyectan durante el despliegue.

### Ejemplo:
Existe la variable `SECRET_MY_VARIABLE=some_value` disponible para el repositorio

En el arhivo `.infra/.env_dev` tenemos
```
my_key=SECRET_MY_VARIABLE
```
durante el despliegue `inject_secrets.sh` lo transforma a

```
my_key=some_value
```

> Si necesita agregar variables `SECRET_` a su repositorio debe hacerlo a travez de un pedido a un admin de infra





