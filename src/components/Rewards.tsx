import * as React from "react";
import { Observable } from "rxjs";
import {
  CProps,
  ComponentList,
  ComponentListProps
} from "../runtime";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig
} from "../protocol";
import {
  ArcReward as Component,
  RewardEntity as Entity,
  RewardData as Data
} from "./";
// TODO: change the import path once the PR is merged
import {
  IRewardQueryOptions as FilterOptions
} from "@daostack/client/src/reward";

interface RequiredProps extends ComponentListProps<Entity, Data, FilterOptions> { }

interface InferredProps {
  arcConfig: ProtocolConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcRewards extends ComponentList<Props, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { arcConfig, filter } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return Entity.search(arcConfig.connection, filter);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { arcConfig } = this.props;

    return (
      <Component id={entity.id} arcConfig={arcConfig}>
      {children}
      </Component>
    );
  }
}

class Rewards extends React.Component<RequiredProps>
{
  render() {
    const { children, sort, filter } = this.props;

    return (
      <Protocol.Config>
      {(arc: ProtocolConfig) =>
        <ArcRewards arcConfig={arc} sort={sort} filter={filter}>
        {children}
        </ArcRewards>
      }
      </Protocol.Config>
    );
  }
}

export default Rewards;

export {
  ArcRewards,
  Rewards
};
