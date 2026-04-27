import ErrorPage from "../../components/ErrorPage";

export default function Error400() {
  return (
    <ErrorPage
      code="403"
      message="Bad Request"
      image="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
    />
  );
}