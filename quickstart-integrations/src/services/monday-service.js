const initMondayClient = require('monday-sdk-js');

const getColumnValue = async (token, itemId, columnId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);
    mondayClient.setApiVersion('2024-04');

    const query = `query($itemId: [ID!], $columnId: [String!]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;

    const variables = { columnId, itemId };

    const response = await mondayClient.api(query, { variables });
    return response.data.items[0].column_values[0].value;
  } catch (err) {
    console.error(err);
  }
};

const changeColumnValue = async (token, boardId, itemId, columnId, value) => {
  try {
    const mondayClient = initMondayClient({ token });
    mondayClient.setApiVersion("2024-01");

    const query = `mutation change_column_value($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
    const variables = { boardId, columnId, itemId, value };

    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    console.error(err);
  }
};


const createSubitem = async (token, parentItemId, subitemName) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);
    mondayClient.setApiVersion('2024-04');

    const query = `
      mutation ($parentItemId: ID!, $subitemName: String!) {
        create_subitem(parent_item_id: $parentItemId, item_name: $subitemName) {
          id
        }
      }
    `;
    
    const variables = {
      parentItemId: String(parentItemId),
      subitemName: subitemName,
    };

    const response = await mondayClient.api(query, { variables });

    if (response.data && response.data.create_subitem) {
      return response.data.create_subitem.id;
    } else {
      throw new Error("Failed to create subitem: " + JSON.stringify(response.data));
    }
  } catch (err) {
    console.error(err);
  }
};



const updateSubitemDueDate = async (token, boardId, subitemId, dueDate) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);
    mondayClient.setApiVersion('2024-04');

    const dateColumnId = await getDateColumnId(token, boardId);

    const query = `
      mutation ($boardId: ID!, $subitemId: ID!, $columnId: String!, $dueDate: JSON!) {
        change_column_value(board_id: $boardId, item_id: $subitemId, column_id: $columnId, value: $dueDate) {
          id
        }
      }
    `;

    const variables = {
      boardId,
      subitemId,
      columnId: dateColumnId,
      dueDate: JSON.stringify({ date: dueDate }),
    };

    const response = await mondayClient.api(query, { variables });

    if (response.data && response.data.change_column_value) {
      return response.data.change_column_value.id;
    } else {
      throw new Error("Failed to update due date: " + JSON.stringify(response.data));
    }
  } catch (err) {
    console.error(err);
  }
};


const getItemName = async (token, itemId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);
    mondayClient.setApiVersion('2024-04');

    const query = `query($itemId: [ID!]) {
      items(ids: $itemId) {
        name
      }
    }`;

    const variables = { itemId: [itemId] };
    const response = await mondayClient.api(query, { variables });
    return response.data.items[0].name;
    
  } catch (err) {
    console.error(err);
  }
};

const getSubitemBoardId = async (token, subitemId) => {
  const mondayClient = initMondayClient();
  mondayClient.setToken(token);
  mondayClient.setApiVersion('2024-04');

  const query = `
    query ($subitemId: [ID!]) {
      items(ids: $subitemId) {
        board {
          id
        }
      }
    }
  `;

  const variables = { subitemId: [subitemId] };
  const response = await mondayClient.api(query, { variables });
  return response.data.items[0].board.id;
};


const getDateColumnId = async (token, boardId) => {
  const mondayClient = initMondayClient();
  mondayClient.setToken(token);
  mondayClient.setApiVersion("2024-04");

  const query = `
    query ($boardId: [ID!]) {
      boards(ids: $boardId) {
        columns {
          id
          title
          type
        }
      }
    }
  `;

  const variables = { boardId: [boardId] };
  const response = await mondayClient.api(query, { variables });

  const columns = response.data.boards[0].columns;
  const dateColumn = columns.find((col) => col.type === "date");

  if (!dateColumn) {
    throw new Error(`No date column found on board ${boardId}`);
  }

  return dateColumn.id;
};


module.exports = {
  getColumnValue,
  changeColumnValue,
  createSubitem,
  updateSubitemDueDate,
  getItemName,
  getSubitemBoardId,
  getDateColumnId,
};