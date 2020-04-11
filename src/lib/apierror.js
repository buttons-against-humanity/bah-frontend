class ApiError extends Error {
  constructor(message, detail) {
    super(message);
    this.detail = detail;
  }
  getDetail() {
    return this.detail;
  }
}

export default ApiError;
