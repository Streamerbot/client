import { serverQueryContent } from '#content/server';

export default eventHandler(async (event) => {
  return serverQueryContent(event)
    .where({
      _type: 'markdown',
      _partial: false,
      navigation: { $ne: false }
    })
    .find();
});
