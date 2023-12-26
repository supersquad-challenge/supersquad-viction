import colors from "@/styles/color";
import { useEffect, useState } from "react";
import styled from "styled-components";

type Props = {
  title: string;
  imgSrc: string;
  isClicked: boolean;
  onClickHandler: () => void;
};

const Category = ({ title, imgSrc, isClicked, onClickHandler }: Props) => {
  // 브라우저 너비 값에 맞게 width, height 값 가변 적용
  const [windowWidth, setWindowWidth] = useState(0);

  const [imgStyle, setImgStyle] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      const handleResizeImg = () => {
        setImgStyle({
          width: Number((windowWidth - 44 - 36) / 4),
          height: Number((windowWidth - 44 - 36) / 4),
        });
      };

      window.addEventListener("resize", handleResize);
      handleResizeImg();

      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [windowWidth]);

  return (
    <Container onClick={() => onClickHandler()}>
      <IconContainer $isclicked={isClicked} style={imgStyle}>
        <img src={imgSrc} style={imgStyle} />
      </IconContainer>
      <Title>{title}</Title>
    </Container>
  );
};

export default Category;

const Container = styled.div`
  width: auto;
  height: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer = styled.div<{ $isclicked: boolean }>`
  margin-bottom: 10px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$isclicked ? `${colors.highlight}` : "rgba(255, 255, 255, 0.4)"};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  color: ${colors.white};
  font-size: 14px;
  font-weight: 600;
  max-width: 50px;

  text-align: center;
`;
