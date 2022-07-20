import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

export default function selectionEnd(
  start = "08:00",
  end = "18:00",
  interval = 30
) {
  let startTime = start;
  let endTime = end;

  let selects = [startTime];
  let multiplicador = interval;

  while (startTime != endTime) {
    startTime = moment(startTime, "HH:mm")
      .add(multiplicador, "minutes")
      .format("HH:mm");
    selects.push(startTime);
  }

  return selects;
}
