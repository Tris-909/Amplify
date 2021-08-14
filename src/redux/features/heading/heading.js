import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, graphqlOperation } from "aws-amplify";
import { createHeading } from "graphql/mutations";
import { listHeadings } from "graphql/queries";
import * as uuid from "uuid";

export const createHeadingThunk = createAsyncThunk(
  "headings/createHeading",
  async (userId) => {
    const heading = {
      id: uuid.v1(),
      userId: userId,
      content: "",
      type: "HEADING",
      x: 0,
      y: 0,
      width: 200,
      height: 100,
    };

    const { data } = await API.graphql(
      graphqlOperation(createHeading, { input: heading })
    );

    return data.createHeading;
  }
);

export const fetchHeadings = createAsyncThunk(
  "headings/listHeadings",
  async (userId) => {
    const { data } = await API.graphql(
      graphqlOperation(listHeadings, {
        filter: {
          userId: {
            eq: userId,
          },
        },
      })
    );

    return data.listHeadings.items;
  }
);

const initialState = {
  headings: {
    data: [],
    status: false,
    error: {},
  },
  editHeading: {
    data: {},
    status: false,
    error: {},
  },
};

export const headings = createSlice({
  name: "headings",
  initialState,
  reducers: {
    updateHeadingContent: (state, action) => {
      const { id, editValue } = action.payload;
      const currentDataList = state.headings.data;

      currentDataList.forEach((item, index) => {
        if (item.id === id) {
          currentDataList[index] = {
            ...currentDataList[index],
            content: editValue,
          };
        }
      });

      state.headings.data = currentDataList;
    },
    updateLocalXYPosition: (state, action) => {
      const { id, newX, newY } = action.payload;

      const currentDataList = state.headings.data;

      currentDataList.forEach((item, index) => {
        if (item.id === id) {
          currentDataList[index] = {
            ...currentDataList[index],
            y: newY,
            x: newX,
          };
        }
      });

      state.headings.data = currentDataList;
    },
    updateLocalWidthHeight: (state, action) => {
      const { id, newWidth, newHeight } = action.payload;

      const currentDataList = state.headings.data;

      currentDataList.forEach((item, index) => {
        if (item.id === id) {
          currentDataList[index] = {
            ...currentDataList[index],
            width: newWidth,
            height: newHeight,
          };
        }
      });

      state.headings.data = currentDataList;
    },
    updateHeadingColor: (state, action) => {
      const { id, newColor } = action.payload;
      const currentDataList = state.headings.data;

      currentDataList.forEach((item, index) => {
        if (item.id === id) {
          currentDataList[index] = {
            ...currentDataList[index],
            color: newColor,
          };
        }
      });

      state.headings.data = currentDataList;
    },
    // EDIT HEADING
    getEditHeading: (state, action) => {
      const { headingId } = action.payload;
      const currentHeadingList = state.headings.data;

      const editHeading = currentHeadingList.filter(
        (item) => item.id === headingId
      );
      state.editHeading = editHeading;
    },
  },

  extraReducers: {
    [createHeadingThunk.pending.type]: (state, action) => {
      state.headings = {
        status: true,
        data: [],
        error: {},
      };
    },
    [createHeadingThunk.fulfilled.type]: (state, action) => {
      state.headings = {
        status: false,
        data: action.payload,
        error: {},
      };
    },
    [createHeadingThunk.rejected.type]: (state, action) => {
      state.headings = {
        status: false,
        data: [],
        error: action.payload,
      };
    },
    [fetchHeadings.pending.type]: (state, action) => {
      state.headings = {
        status: true,
        data: [],
        error: {},
      };
    },
    [fetchHeadings.fulfilled.type]: (state, action) => {
      state.headings = {
        status: false,
        data: action.payload,
        error: {},
      };
    },
    [fetchHeadings.rejected.type]: (state, action) => {
      state.headings = {
        status: false,
        data: [],
        error: action.payload,
      };
    },
  },
});

export const {
  // Heading
  updateHeadingContent,
  updateLocalXYPosition,
  updateLocalWidthHeight,
  updateHeadingColor,
  //Edit Heading
  getEditHeading,
} = headings.actions;

export default headings.reducer;
