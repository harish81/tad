import * as React from "react";
import { ColumnList } from "./ColumnList";
import { ColumnListTypes } from "./defs";
import * as reltab from "reltab";
import { ViewParams } from "../ViewParams";
import { StateRef } from "oneref";
import { AppState } from "../AppState";

export interface DisplayOrderPanelProps {
  schema: reltab.Schema;
  viewParams: ViewParams;
  stateRef: StateRef<AppState>;
}

export const DisplayOrderPanel: React.FC<DisplayOrderPanelProps> = ({
  schema,
  viewParams,
  stateRef,
}) => {
  return (
    <div className="ui-block">
      <h6>
        Displayed Columns{" "}
        <small className="ui-subtext">(drag to reorder)</small>
      </h6>
      <ColumnList
        schema={schema}
        columnListType={ColumnListTypes.DISPLAY}
        items={viewParams.displayColumns}
        stateRef={stateRef}
      />
    </div>
  );
};
