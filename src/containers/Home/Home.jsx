import React, { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { fetchListNotes } from "redux/features/notes/note";
import { fetchHeadings } from "redux/features/heading/heading";
import { fetchImages } from "redux/features/images/images";
import { fetchStickers } from "redux/features/stickers/sticker";
import { getUserInfo, getAuth } from "redux/features/user/userInfo";
import { Auth } from "aws-amplify";
import Note from "components/Note/Note";
import SideHelp from "components/Note/components/SideHelp";
import Heading from "components/Heading/Heading";
import Images from "components/Images/Images";
import HeadingSideHelp from "components/Heading/components/SideHelp/HeadingSideHelp";

// Under development
import Sticker from "components/Stickers/Sticker";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { list } = useSelector((state) => state.notes);
  const { headings } = useSelector((state) => state.headings);
  const { editHeading } = useSelector((state) => state.headings);
  const { images } = useSelector((state) => state.images);
  const { stickers } = useSelector((state) => state.stickers);
  const { userInfo } = useSelector((state) => state.user);
  const [showEditHeading, setShowEditHeading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserName();
    dispatch(getAuth());
  }, []);

  useEffect(() => {
    fetchLists();
  }, [userInfo]);

  const getUserName = async () => {
    const res = await Auth.currentAuthenticatedUser();
    if (res && res.username) {
      // normal signIn
      dispatch(getUserInfo(res.username));
    } else if (res && res.email) {
      // federation signIn
      dispatch(getUserInfo(res.id));
    }
  };

  const fetchLists = () => {
    if (userInfo.data) {
      dispatch(fetchListNotes(userInfo.data.id));
      dispatch(fetchHeadings(userInfo.data.id));
      dispatch(fetchImages(userInfo.data.id));
      dispatch(fetchStickers(userInfo.data.id));
    }
  };

  return (
    <>
      {list.data &&
        list.data.map((singleTodo) => {
          return (
            <Note
              key={singleTodo.id}
              note={singleTodo}
              fetchLists={fetchLists}
            />
          );
        })}
      {headings.data &&
        headings.data.map((singleHeading) => {
          return (
            <Heading
              key={singleHeading.id}
              content={singleHeading.content}
              id={singleHeading.id}
              positionX={singleHeading.x}
              positionY={singleHeading.y}
              headingWidth={singleHeading.width}
              headingHeight={singleHeading.height}
              headingColor={singleHeading.color}
              headingFontsize={singleHeading.fontSize}
              headingRotateDegree={singleHeading.rotateDegree}
              headingFontFamily={singleHeading.fontFamily}
              headingBold={singleHeading.bold}
              headingItalic={singleHeading.italic}
              headingUnderline={singleHeading.underline}
              headingStrikethrough={singleHeading.strikeThrough}
              showEditHeading={singleHeading.id === editHeading?.id}
              setShowEditHeading={setShowEditHeading}
            />
          );
        })}
      {images.data &&
        images.data.map((image) => {
          return <Images key={image.id} image={image} />;
        })}
      {stickers.data &&
        Array.isArray(stickers.data) &&
        stickers.data.map((sticker) => {
          return <Sticker key={sticker.id} sticker={sticker} />;
        })}
      <SideHelp
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchLists={fetchLists}
      />
      {showEditHeading && (
        <HeadingSideHelp setShowEditHeading={setShowEditHeading} />
      )}
    </>
  );
};

export default Home;
