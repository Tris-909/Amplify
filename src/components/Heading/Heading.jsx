import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import TexInput from "./components/EditInput/Input";
import { getEditHeading } from "redux/features/heading/heading";
import { useDispatch, useSelector } from "react-redux";
import { deleteHeadingLocally } from "redux/features/heading/heading";
import { deleteHeading } from "graphql/mutations";
import { BiPen, BiTrash } from "react-icons/bi";
import { executeGraphqlRequest } from "libs/awsLib";
import IconButton from "components/Buttons/IconButton/IconButton";

const Heading = ({
  id,
  content,
  positionX,
  positionY,
  headingWidth,
  headingHeight,
  headingColor,
  headingFontsize,
  headingRotateDegree,
  headingFontFamily,
  showEditHeading,
  headingBold,
  headingItalic,
  headingUnderline,
  headingStrikethrough,
  setShowEditHeading,
}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState(content);
  const { editHeading } = useSelector((state) => state.headings);

  const activeInput = () => {
    setShowEditHeading(true);
    dispatch(getEditHeading({ headingId: id }));
  };

  const deleteHeadingHandler = async () => {
    await executeGraphqlRequest(deleteHeading, { id });
    dispatch(deleteHeadingLocally({ headingId: id }));
  };

  return (
    <>
      {showEditHeading ? (
        <TexInput
          input={input}
          setInput={setInput}
          headingId={id}
          width={headingWidth}
          height={headingHeight}
          positionx={positionX}
          positiony={positionY}
          headingColor={editHeading.color}
          headingFontsize={editHeading.fontSize}
          headingRotateDegree={editHeading.rotateDegree}
          headingFontFamily={editHeading.fontFamily}
          headingBold={editHeading.bold}
          headingItalic={editHeading.italic}
          headingUnderline={editHeading.underline}
          headingStrikethrough={editHeading.strikeThrough}
          showEditHeading={showEditHeading}
        />
      ) : (
        <Box
          height={`${headingHeight.split("p")[0] * 1 + 40}px `}
          width={`${headingWidth.split("p")[0] * 1 + 55}px `}
          fontSize={`${headingFontsize}px `}
          transform={`translate(${positionX}px, ${positionY}px) rotate(${headingRotateDegree}deg)`}
          fontFamily={headingFontFamily}
          color={headingColor}
          fontWeight={headingBold ? "bold" : "normal"}
          fontStyle={headingItalic ? "italic" : "initial"}
          textDecoration={
            headingUnderline
              ? "underline"
              : headingStrikethrough
              ? "line-through"
              : "initial"
          }
          display="inline-block"
          justifyContent="flex-start"
          alignItems="center"
          wordBreak="break-word"
          className="hoverEffect"
        >
          <Box display="flex" gridGap="6">
            {input}
            <Box display="flex" flexDirection="column" gridGap="4">
              <IconButton as={BiPen} onClick={() => activeInput()} />
              <IconButton as={BiTrash} onClick={() => deleteHeadingHandler()} />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Heading;
