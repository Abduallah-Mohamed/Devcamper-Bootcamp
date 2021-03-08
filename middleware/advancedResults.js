const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copying req.query
  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over removeFields to delete these fields from the reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Make reqQuery to be a string so i can play with
  let queryStr = JSON.stringify(reqQuery);

  // add $ before lte | lt | gt | gte .
  queryStr = queryStr.replace(/\b(lte|lt|gt|gte|in)\b/, (match) => `$${match}`);

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Check for select in the req.query
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // excute the query
  const resources = await query;
  // Pagination Result
  const pagination = {};

  // check if it is not the last page
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  // check if it is not the first page
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: resources.length,
    pagination,
    data: resources,
  };

  next();
};

module.exports = advancedResults;
