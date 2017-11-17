const formatTraceable = (type, traceable) =>
  Object.assign(
    {},
    {
      type,
      id: traceable.id,
      name: traceable.name,
      image: traceable.image_url
    }
  );

export default formatTraceable;
