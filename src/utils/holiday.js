const holiday = [
  {date: '2017-12-30', className: 'xiu', content: '休'},
  {date: '2017-12-31', className: 'xiu', content: '休'},
  {date: '2018-1-1', className: 'xiu', content: '休'},
  {date: '2018-2-15', className: 'xiu', content: '休'},
  {date: '2018-2-16', className: 'xiu', content: '休'},
  {date: '2018-2-17', className: 'xiu', content: '休'},
  {date: '2018-2-18', className: 'xiu', content: '休'},
  {date: '2018-2-19', className: 'xiu', content: '休'},
  {date: '2018-2-20', className: 'xiu', content: '休'},
  {date: '2018-2-21', className: 'xiu', content: '休'},
  {date: '2018-2-22', className: 'xiu', content: '休'},
  {date: '2018-4-5', className: 'xiu', content: '休'},
  {date: '2018-4-6', className: 'xiu', content: '休'},
  {date: '2018-4-7', className: 'xiu', content: '休'},
  {date: '2018-4-29', className: 'xiu', content: '休'},
  {date: '2018-4-30', className: 'xiu', content: '休'},
  {date: '2018-5-1', className: 'xiu', content: '休'},
  {date: '2018-6-16', className: 'xiu', content: '休'},
  {date: '2018-6-17', className: 'xiu', content: '休'},
  {date: '2018-6-18', className: 'xiu', content: '休'},
  {date: '2018-9-22', className: 'xiu', content: '休'},
  {date: '2018-9-23', className: 'xiu', content: '休'},
  {date: '2018-9-24', className: 'xiu', content: '休'},
  {date: '2018-10-1', className: 'xiu', content: '休'},
  {date: '2018-10-2', className: 'xiu', content: '休'},
  {date: '2018-10-3', className: 'xiu', content: '休'},
  {date: '2018-10-4', className: 'xiu', content: '休'},
  {date: '2018-10-5', className: 'xiu', content: '休'},
  {date: '2018-10-6', className: 'xiu', content: '休'},
  {date: '2018-10-7', className: 'xiu', content: '休'},
  {date: '2018-9-29', className: 'ban', content: '班'},
  {date: '2018-9-30', className: 'ban', content: '班'},
  {date: '2018-2-11', className: 'ban', content: '班'},
  {date: '2018-4-8', className: 'ban', content: '班'},
  {date: '2018-4-28', className: 'ban', content: '班'},
  {date: '2018-2-24', className: 'ban', content: '班'},
  {date: '2018-12-30', className: 'xiu', content: '休'},
  {date: '2018-12-31', className: 'xiu', content: '休'},
  {date: '2019-1-1', className: 'xiu', content: '休'},
  {date: '2019-2-4', className: 'xiu', content: '休'},
  {date: '2019-2-5', className: 'xiu', content: '休'},
  {date: '2019-2-6', className: 'xiu', content: '休'},
  {date: '2019-2-7', className: 'xiu', content: '休'},
  {date: '2019-2-8', className: 'xiu', content: '休'},
  {date: '2019-2-9', className: 'xiu', content: '休'},
  {date: '2019-2-10', className: 'xiu', content: '休'},
  {date: '2019-4-5', className: 'xiu', content: '休'},
  {date: '2019-4-6', className: 'xiu', content: '休'},
  {date: '2019-4-7', className: 'xiu', content: '休'},
  {date: '2019-4-29', className: 'xiu', content: '休'},
  {date: '2019-4-30', className: 'xiu', content: '休'},
  {date: '2019-5-1', className: 'xiu', content: '休'},
  {date: '2019-6-7', className: 'xiu', content: '休'},
  {date: '2019-6-8', className: 'xiu', content: '休'},
  {date: '2019-6-9', className: 'xiu', content: '休'},
  {date: '2019-9-13', className: 'xiu', content: '休'},
  {date: '2019-9-14', className: 'xiu', content: '休'},
  {date: '2019-9-15', className: 'xiu', content: '休'},
  {date: '2019-10-1', className: 'xiu', content: '休'},
  {date: '2019-10-2', className: 'xiu', content: '休'},
  {date: '2019-10-3', className: 'xiu', content: '休'},
  {date: '2019-10-4', className: 'xiu', content: '休'},
  {date: '2019-10-5', className: 'xiu', content: '休'},
  {date: '2019-10-6', className: 'xiu', content: '休'},
  {date: '2019-10-7', className: 'xiu', content: '休'},
  {date: '2018-12-29', className: 'ban', content: '班'},
  {date: '2019-2-2', className: 'ban', content: '班'},
  {date: '2019-2-3', className: 'ban', content: '班'},
  {date: '2019-4-27', className: 'ban', content: '班'},
  {date: '2019-4-28', className: 'ban', content: '班'},
  {date: '2019-9-29', className: 'ban', content: '班'},
  {date: '2019-10-12', className: 'ban', content: '班'},
  {date: '2020-1-1', className: 'xiu', content: '休'},
  {date: '2020-1-19', className: 'ban', content: '班'},
  {date: '2020-1-24', className: 'xiu', content: '休'},
  {date: '2020-1-25', className: 'xiu', content: '休'},
  {date: '2020-1-26', className: 'xiu', content: '休'},
  {date: '2020-1-27', className: 'xiu', content: '休'},
  {date: '2020-1-28', className: 'xiu', content: '休'},
  {date: '2020-1-29', className: 'xiu', content: '休'},
  {date: '2020-1-30', className: 'xiu', content: '休'},
  {date: '2020-2-1', className: 'ban', content: '班'},
  {date: '2020-4-4', className: 'xiu', content: '休'},
  {date: '2020-4-5', className: 'xiu', content: '休'},
  {date: '2020-4-6', className: 'xiu', content: '休'},
  {date: '2020-4-26', className: 'ban', content: '班'},
  {date: '2020-5-1', className: 'xiu', content: '休'},
  {date: '2020-5-2', className: 'xiu', content: '休'},
  {date: '2020-5-3', className: 'xiu', content: '休'},
  {date: '2020-5-4', className: 'xiu', content: '休'},
  {date: '2020-5-5', className: 'xiu', content: '休'},
  {date: '2020-5-9', className: 'ban', content: '班'},
  {date: '2020-6-25', className: 'xiu', content: '休'},
  {date: '2020-6-26', className: 'xiu', content: '休'},
  {date: '2020-6-27', className: 'xiu', content: '休'},
  {date: '2020-6-28', className: 'ban', content: '班'},
  {date: '2020-9-27', className: 'ban', content: '班'},
  {date: '2020-10-1', className: 'xiu', content: '休'},
  {date: '2020-10-2', className: 'xiu', content: '休'},
  {date: '2020-10-3', className: 'xiu', content: '休'},
  {date: '2020-10-4', className: 'xiu', content: '休'},
  {date: '2020-10-5', className: 'xiu', content: '休'},
  {date: '2020-10-6', className: 'xiu', content: '休'},
  {date: '2020-10-7', className: 'xiu', content: '休'},
  {date: '2020-10-8', className: 'xiu', content: '休'},
  {date: '2020-10-10', className: 'ban', content: '班'},
  {date: '2021-1-1', className: 'xiu', content: '休'},
  {date: '2021-1-2', className: 'xiu', content: '休'},
  {date: '2021-1-3', className: 'xiu', content: '休'},
  {date: '2021-2-7', className: 'ban', content: '班'},
  {date: '2021-2-11', className: 'xiu', content: '休'},
  {date: '2021-2-12', className: 'xiu', content: '休'},
  {date: '2021-2-13', className: 'xiu', content: '休'},
  {date: '2021-2-14', className: 'xiu', content: '休'},
  {date: '2021-2-15', className: 'xiu', content: '休'},
  {date: '2021-2-16', className: 'xiu', content: '休'},
  {date: '2021-2-17', className: 'xiu', content: '休'},
  {date: '2021-2-20', className: 'ban', content: '班'},
  {date: '2021-4-3', className: 'xiu', content: '休'},
  {date: '2021-4-4', className: 'xiu', content: '休'},
  {date: '2021-4-5', className: 'xiu', content: '休'},
  {date: '2021-4-25', className: 'ban', content: '班'},
  {date: '2021-5-1', className: 'xiu', content: '休'},
  {date: '2021-5-2', className: 'xiu', content: '休'},
  {date: '2021-5-3', className: 'xiu', content: '休'},
  {date: '2021-5-4', className: 'xiu', content: '休'},
  {date: '2021-5-5', className: 'xiu', content: '休'},
  {date: '2021-5-8', className: 'ban', content: '班'},
  {date: '2021-6-12', className: 'xiu', content: '休'},
  {date: '2021-6-13', className: 'xiu', content: '休'},
  {date: '2021-6-14', className: 'xiu', content: '休'},
  {date: '2021-9-18', className: 'ban', content: '班'},
  {date: '2021-9-19', className: 'xiu', content: '休'},
  {date: '2021-9-20', className: 'xiu', content: '休'},
  {date: '2021-9-21', className: 'xiu', content: '休'},
  {date: '2021-9-26', className: 'ban', content: '班'},
  {date: '2021-10-1', className: 'xiu', content: '休'},
  {date: '2021-10-2', className: 'xiu', content: '休'},
  {date: '2021-10-3', className: 'xiu', content: '休'},
  {date: '2021-10-4', className: 'xiu', content: '休'},
  {date: '2021-10-5', className: 'xiu', content: '休'},
  {date: '2021-10-6', className: 'xiu', content: '休'},
  {date: '2021-10-7', className: 'xiu', content: '休'},
  {date: '2021-10-9', className: 'ban', content: '班'},
  {date: '2022-1-1', className: 'xiu', content: '休'},
  {date: '2022-1-2', className: 'xiu', content: '休'},
  {date: '2022-1-3', className: 'xiu', content: '休'},
  {date: '2022-1-29', className: 'ban', content: '班'},
  {date: '2022-1-30', className: 'ban', content: '班'},
  {date: '2022-1-31', className: 'xiu', content: '休'},
  {date: '2022-1-31', className: 'xiu', content: '休'},
  {date: '2022-2-1', className: 'xiu', content: '休'},
  {date: '2022-2-2', className: 'xiu', content: '休'},
  {date: '2022-2-3', className: 'xiu', content: '休'},
  {date: '2022-2-4', className: 'xiu', content: '休'},
  {date: '2022-2-5', className: 'xiu', content: '休'},
  {date: '2022-2-6', className: 'xiu', content: '休'},
  {date: '2022-4-2', className: 'ban', content: '班'},
  {date: '2022-4-3', className: 'xiu', content: '休'},
  {date: '2022-4-4', className: 'xiu', content: '休'},
  {date: '2022-4-5', className: 'xiu', content: '休'},
  {date: '2022-4-24', className: 'ban', content: '班'},
  {date: '2022-4-30', className: 'xiu', content: '休'},
  {date: '2022-5-1', className: 'xiu', content: '休'},
  {date: '2022-5-2', className: 'xiu', content: '休'},
  {date: '2022-5-3', className: 'xiu', content: '休'},
  {date: '2022-5-4', className: 'xiu', content: '休'},
  {date: '2022-5-7', className: 'ban', content: '班'},
  {date: '2022-6-3', className: 'xiu', content: '休'},
  {date: '2022-6-4', className: 'xiu', content: '休'},
  {date: '2022-6-5', className: 'xiu', content: '休'},
  {date: '2022-9-10', className: 'xiu', content: '休'},
  {date: '2022-9-11', className: 'xiu', content: '休'},
  {date: '2022-9-12', className: 'xiu', content: '休'},
  {date: '2022-10-1', className: 'xiu', content: '休'},
  {date: '2022-10-1', className: 'xiu', content: '休'},
  {date: '2022-10-2', className: 'xiu', content: '休'},
  {date: '2022-10-3', className: 'xiu', content: '休'},
  {date: '2022-10-4', className: 'xiu', content: '休'},
  {date: '2022-10-5', className: 'xiu', content: '休'},
  {date: '2022-10-6', className: 'xiu', content: '休'},
  {date: '2022-10-7', className: 'xiu', content: '休'},
  {date: '2022-10-8', className: 'ban', content: '班'},
  {date: '2022-10-9', className: 'ban', content: '班'},
  {date: '2022-12-31', className: 'xiu', content: '休'},
  {date: '2023-1-1', className: 'xiu', content: '休'},
  {date: '2023-1-2', className: 'xiu', content: '休'},
  {date: '2023-1-21', className: 'xiu', content: '休'},
  {date: '2023-1-22', className: 'xiu', content: '休'},
  {date: '2023-1-23', className: 'xiu', content: '休'},
  {date: '2023-1-24', className: 'xiu', content: '休'},
  {date: '2023-1-25', className: 'xiu', content: '休'},
  {date: '2023-1-26', className: 'xiu', content: '休'},
  {date: '2023-1-27', className: 'xiu', content: '休'},
  {date: '2023-1-28', className: 'ban', content: '班'},
  {date: '2023-1-29', className: 'ban', content: '班'},
  {date: '2023-4-5', className: 'xiu', content: '休'},
  {date: '2023-4-23', className: 'ban', content: '班'},
  {date: '2023-4-29', className: 'xiu', content: '休'},
  {date: '2023-4-30', className: 'xiu', content: '休'},
  {date: '2023-5-1', className: 'xiu', content: '休'},
  {date: '2023-5-2', className: 'xiu', content: '休'},
  {date: '2023-5-3', className: 'xiu', content: '休'},
  {date: '2023-5-6', className: 'ban', content: '班'},
  {date: '2023-6-22', className: 'xiu', content: '休'},
  {date: '2023-6-23', className: 'xiu', content: '休'},
  {date: '2023-6-24', className: 'xiu', content: '休'},
  {date: '2023-6-25', className: 'ban', content: '班'},
  {date: '2023-9-29', className: 'xiu', content: '休'},
  {date: '2023-9-30', className: 'xiu', content: '休'},
  {date: '2023-10-1', className: 'xiu', content: '休'},
  {date: '2023-10-2', className: 'xiu', content: '休'},
  {date: '2023-10-3', className: 'xiu', content: '休'},
  {date: '2023-10-4', className: 'xiu', content: '休'},
  {date: '2023-10-5', className: 'xiu', content: '休'},
  {date: '2023-10-6', className: 'xiu', content: '休'},
  {date: '2023-10-7', className: 'ban', content: '班'},
  {date: '2023-10-8', className: 'ban', content: '班'},
  {date: '2023-10-8', className: 'ban', content: '班'},
]
export {holiday}
