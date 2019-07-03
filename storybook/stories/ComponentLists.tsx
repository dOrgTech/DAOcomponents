import * as React from "react";
import BN from "bignumber.js";
import * as R from "ramda";
import { storiesOf } from "@storybook/react";
import {
  Arc,
  DevArcConfig as arcConfig,
  DAOs,
  DAO,
  DAOData,
  Members,
  Member,
  MemberData,
  Proposal,
  Proposals,
  ProposalData,
  Reputations,
  Reputation,
  ReputationData,
  Tokens,
  Token,
  TokenData,
  Rewards,
  Reward,
  RewardData
} from "../../src/";
import ComponentListView, { PropertyType } from "../helpers/ComponentListView";

export default () =>
  storiesOf("Component Lists", module)
    .add("DAOs", () => (
      <ComponentListView
        name={"DAOs"}
        ComponentList={DAOs}
        Component={DAO}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
          {props.children}
          </Arc>
        )}
        propEditors={[]}
        getId={(dao: DAOData) => `DAO: ${dao.address}`}
      />
    ))
    .add("Members", () => (
      <ComponentListView
        name={"Members"}
        ComponentList={Members}
        Component={Member}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
            <DAO address={props.dao}>
            {props.children}
            </DAO>
          </Arc>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
            type: PropertyType.string
          },
          {
            friendlyName: "All DAOs",
            name: "allDAOs",
            defaultValue: false,
            type: PropertyType.boolean
          }
        ]}
        getId={(member: MemberData) => `Member: ${member.address}`}
      />
    ))
    .add("Proposals", () => (
      <ComponentListView
        name={"Proposals"}
        ComponentList={Proposals}
        Component={Proposal}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
            <DAO address={props.dao}>
            {props.children}
            </DAO>
          </Arc>
        )}
        propEditors={[
          {
            friendlyName: "DAO Address",
            name: "dao",
            defaultValue: "0xe7a2c59e134ee81d4035ae6db2254f79308e334f",
            type: PropertyType.string
          },
          {
            friendlyName: "All DAOs",
            name: "allDAOs",
            defaultValue: false,
            type: PropertyType.boolean
          }
          // TODO: add filtering and sorting to each component list editor
          /*,
          {
            friendlyName: "Filters",
            name: "filters",
            defaultValue: {},
            type: PropertyType.object
          },
          {
            friendlyName: "Sort",
            name: "sort",
            defaultValue: function(unsortedList: any): any {
              const sortBySubmittedTime = (o:any) => (new BN(o.data.contributionReward!.ethReward).toNumber())
              return R.sortBy(sortBySubmittedTime)(unsortedList)
            },
            type: PropertyType.object
          }*/
        ]}
        getId={(proposal: ProposalData) => `Proposal: ${proposal.id}`}
      />
    ))
    .add("Reputations", () => (
      <ComponentListView
        name={"Reputations"}
        ComponentList={Reputations}
        Component={Reputation}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
          {props.children}
          </Arc>
        )}
        propEditors={[]}
        getId={(reputation: ReputationData) => `Reputation: ${reputation.address}`}
      />
    ))
    .add("Tokens", () => (
      <ComponentListView
        name={"Tokens"}
        ComponentList={Tokens}
        Component={Token}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
          {props.children}
          </Arc>
        )}
        propEditors={[]}
        getId={(token: TokenData) => `Token: ${token.address}`}
      />
    ))
    .add("Rewards", () => (
      <ComponentListView
        name={"Rewards"}
        ComponentList={Rewards}
        Component={Reward}
        RequiredContext={(props) => (
          <Arc config={arcConfig}>
          {props.children}
          </Arc>
        )}
        propEditors={[]}
        getId={(reward: RewardData) => `Reward: ${reward.id}`}
      />
    ));
