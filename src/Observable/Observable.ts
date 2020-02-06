class Observable {
  private _observers: {
    [key: string]: Array<Function>;
  } = {};
  constructor() {
    this._observers = {};

    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.emit = this.emit.bind(this);
  }

  getObservers(type?: string) {
    return type ? this._observers[type] : this._observers;
  }

  subscribe(type: string, callback: Function) {
    if (!this._observers[type]) this._observers[type] = [];
    this._observers[type].push(callback);
  }
  unsubscribe(type: string, callback?: Function) {
    if (typeof callback !== "undefined"){
      this._observers[type] = this._observers[type].filter(el => el !== callback);
    }
    else {
      this._observers[type] = [];
    }
  }
  emit(type: string, data?: any) {
    if (this._observers.hasOwnProperty(type)) {
      this._observers[type].forEach(observer => observer(data));
    }
  }
}

export default Observable;
