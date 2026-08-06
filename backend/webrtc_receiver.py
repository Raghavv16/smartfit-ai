import threading

peer_connection = None
latest_frame = None
workout_active = False
current_user_id = None
frame_lock = threading.Lock()
display_thread = None
phone_connected = False
processed_frame = None
processed_frame_lock = threading.Lock()