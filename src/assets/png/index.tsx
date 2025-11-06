import logo from './logo.png'
import favIcon from './fav-icon.png'
import notFoundImage from './404-image.jpeg'

export const Logo = logo
export const FavIcon = favIcon
export const NotFoundImage = notFoundImage

// Placeholder exports for missing icons (using existing images as fallbacks)
export const UserIcon = favIcon // Using fav-icon as fallback for user icon

export default {
  Logo,
  FavIcon,
  NotFoundImage,
  UserIcon
}
