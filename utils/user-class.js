class User {
  constructor(id, nickname, isMuted) {
    //todo this
    this.id = id;
    this.nickname = nickname;
    this.isOnVoiceChat = true;
    this.isMuted = isMuted;
    
    this.locks = [];
  }

  get isOnVoiceChat() {
    return this._isOnVoiceChat;
  }

  set isOnVoiceChat(value) {
    this._isOnVoiceChat = value;
  }

  get isMuted() {
    return this._isMuted;
  }

  set isMuted(value) {
    this._isMuted = value;
  }

  addLock(lock) {
    this.locks.push(lock)
  }

  removeLock(value) {
    this.locks = this.locks.filter(lock => lock !== value);
  }
}

module.exports = User;