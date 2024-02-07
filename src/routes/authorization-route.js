import { Navigate } from 'react-router-dom';
import { useAuthorization } from '../util/use-authorization';


export function AuthorizationRoute(props) {
  const { roles, children } = props;
  const { checkAccess } = useAuthorization();
  const canAccess = checkAccess({ accessRoles: roles });

  return canAccess ? children : children;
  // TODO: uncomment - Comment to logged in without authentication
  // return canAccess ? children : <Navigate to={'/login'} />; 
}
