class Chats {
    id = null;
    title = [];
    created = null;

    constructor(id, title, created) {
        this.id = id;
        this.title = title;
        this.created = created;
    }
}

class UserChats {
    userId = null;
    chats = [];

    constructor(userId, chats) {
        this.userId = userId;
        this.chats = chats;
    }
}
