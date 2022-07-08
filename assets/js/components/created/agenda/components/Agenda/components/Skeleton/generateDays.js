const moment = require("moment");

function generateDays(scale = 30, startHour = 8, endHour = 18) {
  const today = new Date();

  let days = [
    {
      start: moment(today)
        .subtract(2, "d")
        .set({ hour: startHour, minute: 0, second: 0, millisecond: 0 }),
      end: moment(today)
        .subtract(2, "d")
        .set({ hour: endHour, minute: 0, second: 0, millisecond: 0 })
    },
    {
      start: moment(today)
        .subtract(1, "d")
        .set({ hour: startHour, minute: 0, second: 0, millisecond: 0 }),
      end: moment(today)
        .subtract(1, "d")
        .set({ hour: endHour, minute: 0, second: 0, millisecond: 0 })
    },
    {
      start: moment(today).set({
        hour: startHour,
        minute: 0,
        second: 0,
        millisecond: 0
      }),
      end: moment(today).set({
        hour: endHour,
        minute: 0,
        second: 0,
        millisecond: 0
      })
    },
    {
      start: moment(today)
        .add(1, "d")
        .set({ hour: startHour, minute: 0, second: 0, millisecond: 0 }),
      end: moment(today)
        .add(1, "d")
        .set({ hour: endHour, minute: 0, second: 0, millisecond: 0 })
    },
    {
      start: moment(today)
        .add(2, "d")
        .set({ hour: startHour, minute: 0, second: 0, millisecond: 0 }),
      end: moment(today)
        .add(2, "d")
        .set({ hour: endHour, minute: 0, second: 0, millisecond: 0 })
    },
    {
      start: moment(today)
        .add(3, "d")
        .set({ hour: startHour, minute: 0, second: 0, millisecond: 0 }),
      end: moment(today)
        .add(3, "d")
        .set({ hour: endHour, minute: 0, second: 0, millisecond: 0 })
    },
    {
      start: moment(today)
        .add(4, "d")
        .set({ hour: startHour, minute: 0, second: 0, millisecond: 0 }),
      end: moment(today)
        .add(4, "d")
        .set({ hour: endHour, minute: 0, second: 0, millisecond: 0 })
    }
  ];

  let appointaments = [];

  days.forEach((element, index) => {
    let start = element.start;
    let end = element.end;

    for (let index = start; index < end; index = index.add(30, "minutes")) {
      if (Math.random() < 0.5) {
        appointaments.push({
          startDate: moment(index),
          endDate: moment(index).add(scale, "minutes")
        });
      }
    }
  });

  return appointaments;
}

export default generateDays;
