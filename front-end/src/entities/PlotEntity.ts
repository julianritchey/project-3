import PlotLayout from "./PlotLayout";
import Trace from "./Trace";

export default interface PlotEntity {
  data: Trace[];
  layout: PlotLayout;
}
