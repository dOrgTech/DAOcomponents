import * as React from "react";
import {
  Component,
  ComponentLogs,
  BaseProps
} from "../runtime";
import {
  CreateContextFeed
} from "../runtime/ContextFeed";
import {
  Arc,
  ArcConfig
} from "../protocol";
import {
  Reward as Entity,
  IRewardState as Data
} from "@daostack/client";

// TODO
type Code = { }

interface RequiredProps extends BaseProps {
  // Reward ID
  id: string;
}

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps;

class ArcReward extends Component<Props, Entity, Data, Code>
{
  createEntity(): Entity {
    const { id, arcConfig } = this.props;

    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }

    return new Entity(id, arcConfig.connection);
  }

  public static get Entity() {
    return CreateContextFeed(this._EntityContext.Consumer);
  }

  public static get Data() {
    return CreateContextFeed(this._DataContext.Consumer);
  }

  public static get Code() {
    return CreateContextFeed(this._CodeContext.Consumer);
  }

  public static get Logs() {
    return CreateContextFeed(this._LogsContext.Consumer);
  }

  protected static _EntityContext = React.createContext({ });
  protected static _DataContext   = React.createContext({ });
  protected static _CodeContext   = React.createContext({ });
  protected static _LogsContext   = React.createContext({ });
}

class Reward extends React.Component<RequiredProps>
{
  render() {
    const { id, children } = this.props;

    return (
      <Arc.Config>
      {(arc: ArcConfig) => (
        <ArcReward id={id} arcConfig={arc}>
        {children}
        </ArcReward>
      )}
      </Arc.Config>
    );
  }

  public static get Entity() {
    return ArcReward.Entity;
  }

  public static get Data() {
    return ArcReward.Data;
  }

  public static get Code() {
    return ArcReward.Code;
  }

  public static get Logs() {
    return ArcReward.Logs;
  }
}

export default Reward;

export {
  ArcReward,
  Reward,
  Props  as RewardProps,
  Entity as RewardEntity,
  Data   as RewardData,
  Code   as RewardCode,
  ComponentLogs
};
