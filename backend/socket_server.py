import socketio

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

socket_app = socketio.ASGIApp(
    sio,
    socketio_path="socket.io"
    )


@sio.event
async def connect(sid, environ):
    print("Connected:", sid)


@sio.event
async def disconnect(sid):
    print("Disconnected:", sid)