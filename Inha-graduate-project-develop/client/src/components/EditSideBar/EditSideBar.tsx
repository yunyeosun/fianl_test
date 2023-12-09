import { Button, Modal, Tabs, Typography } from "antd";
import { useState } from "react";
import { ExclamationCircleFilled, PlusCircleOutlined } from "@ant-design/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { courseState, dayState, travelState, userState } from "../../state";
import { CourseItems } from "../CourseItems";
import { useNavigate } from "react-router-dom";
import {
  Container,
  StyledDrawer,
  TitleContainer,
} from "../CourseSideBar/styles";
import { StyledButton } from "./styles";
import { useGetSavedCourseById } from "../../hooks";

export default function CourseSideBar() {
  const { Title } = Typography;
  const course = useRecoilValue(courseState).items;
  const travel = useRecoilValue(travelState);
  const user = useRecoilValue(userState);
  const setDay = useSetRecoilState(dayState);
  const day = useRecoilValue(dayState);
  const travelDay = user.travel_day;
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetSavedCourseById("부산");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const tabItems = ["여행지", "음식점", "숙소"];
  const showConfirm = () => {
    confirm({
      title: "저장이 완료되었습니다.",
      icon: <ExclamationCircleFilled />,
      content: "마이페이지로 이동하시겠습니까?",
      onOk() {
        navigate("/mypage");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <>
      <Container width={400}>
        <TitleContainer>
          <div>
            <Title level={4} style={{ margin: "0px" }}>
              {travel}
            </Title>
            <span>2023.12.07 ~ 2023.12.07</span>
          </div>
          <Button type="primary" onClick={showConfirm}>
            저장하기
          </Button>
        </TitleContainer>
        <Tabs
          defaultActiveKey="1"
          centered
          onChange={(activeKey) => setDay(Number(activeKey) - 1)}
          items={new Array(travelDay).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
              label: `Day ${id}`,
              key: id,
              children: (
                <StyledButton onClick={showDrawer}>
                  <PlusCircleOutlined />
                  새로운 장소
                </StyledButton>
              ),
            };
          })}
        />
        {course[day].map((item) => {
          return (
            <CourseItems
              button="edit"
              title={item.children}
              address={item.address}
              type={item.type}
              img={item.img}
            />
          );
        })}
      </Container>
      <StyledDrawer
        title="새로운 장소 추가"
        placement="left"
        onClose={onClose}
        open={open}
        width={400}
      >
        <Tabs
          defaultActiveKey="1"
          centered
          items={tabItems.map((item, idx) => {
            return {
              label: item,
              key: idx,
            };
          })}
        />
        {isLoading ? (
          <>Loading...</>
        ) : (
          data?.map((item) => {
            return (
              <CourseItems
                button="rate"
                isRate={true}
                rate={item.rating}
                title={item.name}
                address={item.address}
                type={item.type}
                img={item.image_url}
              />
            );
          })
        )}
      </StyledDrawer>
    </>
  );
}
