class GameSession {
    orders = [];
    state = '';

    set state(value) {
        if (this.state == value)
        {
           return;
        }

       this.state = value;
    }

    get getState()
    {
        return this.state;
    }
}