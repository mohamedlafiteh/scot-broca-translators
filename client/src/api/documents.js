export const getDocuments = () => {
  return fetch("/api/documents", {
    method: "get",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json());
};

export const postDocument = (
  from_language_code,
  to_language_code,
  name,
  due_date,
  content
) => {
  return fetch("/api/documents", {
    method: "post",
    body: JSON.stringify({
      from_language_code,
      to_language_code,
      name,
      due_date,
      content
    }),
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(this.handleErrors)
    .then(this.resetForm)
    .catch(error => {
      this.setState({
        hasErrors: true,
        errorMessage: error
      });
    });
};
