import * as React from "react";
import { Context } from "react";
import memoize from "memoize-one";
import { Subscription } from "rxjs";
import * as R from "ramda";

import { ComponentLogs } from "../lib/logging/ComponentLogs";
export { ComponentLogs };

// Note: Web3Bindings aims to automate this protocol API layer
import Arc from "@daostack/client";
import arc from "../lib/integrations/arc";
import { IStateful } from "@daostack/client/src/types"

interface State<Data, Code> {
  data?: Data;
  code?: Code;
  // TODO: Prose
  logs: ComponentLogs;
}

export abstract class Component<
  Props,
  Entity extends IStateful<Data>,
  Data,
  Code
> extends React.Component<
    Props, State<Data, Code>
  >
{
  // Create the entity this component represents. This entity gives access
  // to the component's code, prose, and data. For example: DAO, Proposal, Member.
  // Note: This entity is not within the component's state, but instead a memoized
  // property that will be recreated whenever necessary. See `private entity` below...
  protected abstract createEntity(props: Props, arc: Arc): Entity;

  // See here for more information on the React.Context pattern:
  // https://reactjs.org/docs/context.html
  protected static EntityContext<Entity>(): Context<Entity> {
    return Component._EntityContext as any;
  }

  protected static DataContext<Data>(): Context<Data> {
    return Component._DataContext as any;
  }

  protected static CodeContext<Code>(): Context<Code> {
    return Component._CodeContext as any;
  }

  protected static LogsContext(): Context<ComponentLogs> {
    return Component._LogsContext as any;
  }

  // Untemplatized static context objects
  private static _EntityContext = React.createContext({ });
  private static _DataContext = React.createContext({ });
  private static _CodeContext = React.createContext({ });

  // Logging context
  private static _LogsContext = React.createContext({ });

  private entity = memoize(
    // This will only run when the function's arguments have changed :D
    // allowing us to only recreated/refetch the entity data when the props or arc context have changed.
    // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    this.createEntityWithProps
  );

  // Our graphql query's subscriber object
  private _subscription?: Subscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      logs: new ComponentLogs()
    };

    this.onQueryData = this.onQueryData.bind(this);
    this.onQueryError = this.onQueryError.bind(this);
    this.onQueryComplete = this.onQueryComplete.bind(this);
  }

  public render() {
    const EntityProvider = Component.EntityContext<Entity>().Provider as any;
    const DataProvider = Component.DataContext<Data>().Provider as any;
    const CodeProvider = Component.CodeContext<Code>().Provider as any;
    const LogsProvider = Component.LogsContext().Provider;

    const { children } = this.props;
    const entity = this.entity(this.props, arc);
    const { data, code, logs } = this.state;

    logs.reactRendered();

    if (typeof children === "function") {
      return children(entity, data, code, logs);
    } else {
      return (
        <EntityProvider value={entity}>
        <DataProvider value={data}>
        <CodeProvider value={code}>
        <LogsProvider value={logs}>
          {children}
        </LogsProvider>
        </CodeProvider>
        </DataProvider>
        </EntityProvider>
      )
    }
  }

  public componentWillMount() {
    // prefetch the entity
    this.entity(this.props, arc);
  }

  public componentWillUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  private createEntityWithProps(props: Props, arc: Arc): Entity | undefined {
    const { logs } = this.state;

    logs.entityCreated();

    this.clearPrevState();

    try {
      const entity = this.createEntity(props, arc);

      logs.dataQueryStarted();

      // subscribe to this entity's state changes
      this._subscription = entity.state().subscribe(
        this.onQueryData,
        this.onQueryError,
        this.onQueryComplete
      );

      // TODO: create code + prose
      return entity;
    } catch (error) {
      logs.entityCreationFailed(error);
      return undefined;
    }
  }

  private clearPrevState() {
    this.mergeState({
      data: undefined,
      code: undefined,
      // TOOD: prose: undefined
    });
  }

  private onQueryData(data: Data) {
    this.state.logs.dataQueryReceivedData();

    this.mergeState({
      data: data
    });
  }

  private onQueryError(error: Error) {
    this.state.logs.dataQueryFailed(error);
  }

  private onQueryComplete() {
    this.state.logs.dataQueryCompleted();
  }

  private mergeState(merge: any) {
    this.setState(
      R.mergeDeepRight(this.state, merge)
    );
  }
}
