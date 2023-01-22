// mongodb queires global service

// create
exports.create = async (model, body) => {
  return await model.create(body);
};

exports.upsert = async (model, filter, body) => {
  return await model.findOneAndUpdate(
    filter,
    { $set: { ...body } },
    {
      new: true,
      upsert: true,
      runValidators: true,
      context: "query",
      // runValidators:true,
    }
  );
};
exports.update = async (model, filter, body) => {
  return await model.findOneAndUpdate(
    filter,
    { $set: { ...body } },
    {
      new: true,
      upsert: false,
      runValidators: true,
      context: "query",
      // runValidators:true,
    }
  );
};

// find and filter
exports.find = async (model, filter, projection = {}, pagination = {}, sort = {}, populate = "") => {
  return await model.find(filter, projection).skip(pagination.skip).limit(pagination.limit).sort(sort).populate(populate);
};

exports.findOne = async (model, filter, projection = {}, populate = "") => {
  return await model.findOne(filter, projection).populate(populate);
};

exports.countDocuments = async (model, filter) => {
  return await model.countDocuments(filter);
};

exports.updateMany = async (model, filter, body) => {
  return await model.updateMany(filter, body, { new: true });
};

// delete
exports.findOneAndSoftDelete = async (model, filter, body) => {
  return await model.findOneAndUpdate(filter, body, { new: true });
};

exports.findOneAndHardDelete = async (model, filter) => {
  return await model.findOneAndDelete(filter);
};

exports.deleteMany = async (model, filter) => {
  return await model.deleteMany(filter);
};

// aggregation
exports.aggregate = async (model, query) => {
  return await model.aggregate(query);
};
