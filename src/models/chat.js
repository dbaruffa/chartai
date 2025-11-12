class ChatTurn {
    role = null;
    parts = [];
    img = null;
    timestamp = null;

    constructor(role, parts, img, timestamp) {
        this.role = role;
        this.parts = parts;
        this.img = img;
        this.timestamp = timestamp;
    }
}

class Chat {
    id = null;
    history = [];

    constructor(id, history) {
        this.id = id;
        this.history = history;
    }
}
