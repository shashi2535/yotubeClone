/* eslint-disable indent */
/* eslint-disable no-console */
import { FindOptions, Op } from 'sequelize';
import { logger } from '../config';
class SequelizeFilterSortUtil {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }
  async filterSort(options: any, populateData: any) {
    const queryObj = { ...options };
    //! for filtering using this method
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify({ ...queryObj });
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // ! for pagination
    const page = options.page * 1 || 1;
    const limit = options.limit * 1 || 10;
    const skip = (page - 1) * limit;
    //! for serch and filter
    const whereClause = options?.search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${options?.search}%` } },
            { description: { [Op.like]: `%${options?.search}%` } },
          ],
        }
      : JSON.parse(queryStr);
    //! query
    const queryOptions: FindOptions = {
      where: whereClause,
      // <<<<<<<< for sorting  >>>>>
      order: options?.sort
        ? options?.sort.includes('-1')
          ? [['created_at', 'DESC']]
          : [['created_at', 'ASC']]
        : [['created_at', 'ASC']],
      // <<<<<<<< for pagination >>>>>>>
      offset: skip,
      limit: limit,
      // <<<<< for exect data >>>>>>>
      raw: true,
      nest: true,
      ...populateData,
    };
    const results = await this.model.findAll(queryOptions);
    return results;
  }
}
export { SequelizeFilterSortUtil };
