const mondayService = require('../services/monday-service');

async function executeAction(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  if (!payload || !payload.inputFields) {
    return res.status(400).json({ message: 'Missing inputFields' });
  }

  try {
    const { boardId, itemId, status } = payload.inputFields;

    // Get Parent Item Name
    const itemName = await mondayService.getItemName(shortLivedToken, itemId);

    // Create SubItem under Parent Name
    const subitemId = await mondayService.createSubitem(shortLivedToken, itemId, itemName);

    // Get the columnID from parent item
    const dateColumnId = await mondayService.getDateColumnId(shortLivedToken, boardId);

    // Get original date value from the parent item
    const originalDateString = await mondayService.getColumnValue(shortLivedToken, itemId, dateColumnId);

    let baseDate = new Date();

    try {
      const parsed = JSON.parse(originalDateString);
      if (parsed && parsed.date) {
        baseDate = new Date(parsed.date);
      }
    } catch (err) {
      console.warn('[DEBUG] Could not parse date4, using today instead');
    }
    
    baseDate.setDate(baseDate.getDate() + 7);
    const formattedDueDate = baseDate.toISOString().split('T')[0];

    const subitemBoardId = await mondayService.getSubitemBoardId(shortLivedToken, subitemId);
    await mondayService.updateSubitemDueDate(shortLivedToken, subitemBoardId, subitemId, formattedDueDate);
    
    return res.status(200).json({ message: 'Subitem created and due date updated.' });

  } catch (err) {
    console.error('Error in executeAction:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getRemoteListOptions(req, res) {
  try {
    return res.status(200).send([]);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = {
  executeAction,
  getRemoteListOptions,
};
