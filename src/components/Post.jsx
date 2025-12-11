import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { User } from './User.jsx'
import { LikeButton } from './LikeButton.jsx'

export function Post({
  title,
  contents,
  author,
  id,
  imageUrl,
  fullPost = false,
}) {
  const PLACE_HOLDER_IMAGE_URL =
    'https://www.foodservicerewards.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781'
  console.log('Post props:', { id, title, imageUrl })

  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}
      <div>
        <img
          src={imageUrl || PLACE_HOLDER_IMAGE_URL}
          alt={title}
          width={100}
          height={100}
        />
      </div>
      {fullPost && <div>{contents}</div>}
      {author && (
        <em>
          {fullPost && <br />}
          Written by <User {...author} />
        </em>
      )}
      <LikeButton postId={id} />
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.arrayOf(PropTypes.propTypes),
  author: PropTypes.shape(User.propTypes),
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  fullPost: PropTypes.bool,
}
