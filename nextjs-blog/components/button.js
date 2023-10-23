import styles from '../styles/Home.module.css';

const Button = ({ text, onClick }) => {
    return (
      <button
        type="button"
        className={styles.signupButton}
        onClick={onClick}
      >
        {text}
      </button>
    );
  };
  
  export default Button;