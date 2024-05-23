const PrivateRoute = ({ element }) => {
    const { auth } = useAuth();
    return auth ? element : <Navigate to="/signin" />;
  };
  