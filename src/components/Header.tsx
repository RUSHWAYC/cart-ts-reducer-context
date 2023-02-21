import Nav from "./Nav";

interface IProps {
  viewCart: boolean;
  setViewCart: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ viewCart, setViewCart }: IProps) => {
  const content = (
    <header className="header">
      <div className="header__title-bar">
        <h1>Acme Co.</h1>
        <div className="header__price-box">
          <p>Total Items: </p>
          <p>Total Price: </p>
        </div>
      </div>
      <Nav viewCart={viewCart} setViewCart={setViewCart} />
    </header>
  );

  return content;
};

export default Header;
