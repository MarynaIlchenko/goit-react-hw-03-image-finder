import PropTypes from 'prop-types';
import style from './Button.module.css';

export const Button = ({ onLoadMore, loading }) => {
  return (
    <div className={style.ButtonBlock}>
      {!loading && (
        <button onClick={onLoadMore} className={style.Button} type="button">
          Load More
        </button>
      )}
    </div>
  );
};

Button.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
