import * as React from "react";
import { Observable } from "rxjs";
import {
  CEntity,
  CProps,
  ComponentList,
  BaseProps
} from "../runtime";
import {
  Arc,
  ArcConfig
} from "../protocol";
import {
  ArcReputation
} from "./";

// TODO: remove once change is merged
import {
  Reputation
} from "@daostack/client";
import gql from "graphql-tag";

interface RequiredProps { }

interface InferredProps {
  // Arc Instance
  arcConfig: ArcConfig | undefined;
}

type Props = RequiredProps & InferredProps & BaseProps;

class ArcReputations extends ComponentList<Props, ArcReputation>
{
  createObservableEntities(): Observable<CEntity<ArcReputation>[]> {
    const { arcConfig } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }

    // TODO: remove once change is merged
    const arc = arcConfig.connection;
    const query = gql`
      {
        reputationContracts {
          id
        }
      }
    `;
    return arc._getObservableList(
      query,
      (r: any) => new Reputation(r.id, arc)
    ) as Observable<Reputation[]>;
  }

  renderComponent(entity: CEntity<ArcReputation>, children: any): React.ComponentElement<CProps<ArcReputation>, any> {
    const { arcConfig } = this.props;

    return (
      <ArcReputation address={entity.address} arcConfig={arcConfig}>
        {children}
      </ArcReputation>
    );
  }
}

class Reputations extends React.Component<RequiredProps>
{
  render() {
    const { children } = this.props;

    return (
      <Arc.Config>
      {(arc: ArcConfig) =>
        <ArcReputations arcConfig={arc}>
          {children}
        </ArcReputations>
      }
      </Arc.Config>
    )
  }
}

export default Reputations;

export {
  ArcReputations,
  Reputations
};
