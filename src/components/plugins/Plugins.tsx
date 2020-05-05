// import * as React from "react";
// import { Observable } from "rxjs";
// import { ISchemeQueryOptions as FilterOptions } from "@daostack/client";
// import {
//   Arc as Protocol,
//   ArcConfig as ProtocolConfig,
//   ArcScheme as Component,
//   SchemeEntity as Entity,
//   SchemeData as Data,
//   CProps,
//   ComponentList,
//   ComponentListLogs,
//   ComponentListProps,
// } fro..../";
// import { CreateContextFeed } from "../runtime/ContextFeed";

// type RequiredProps = ComponentListProps<Entity, Data, FilterOptions>;

// interface InferredProps {
//   arcConfig: ProtocolConfig | undefined;
// }

// type Props = RequiredProps & InferredProps;

// class ArcSchemes extends ComponentList<Props, Component> {
//   createObservableEntities(): Observable<Entity[]> {
//     const { arcConfig, filter } = this.props;
//     if (!arcConfig) {
//       throw Error(
//         "Arc Config Missing: Please provide this field as a prop, or use the inference component."
//       );
//     }
//     return Entity.search(arcConfig.connection, filter);
//   }

//   renderComponent(
//     entity: Entity,
//     children: any
//   ): React.ComponentElement<CProps<Component>, any> {
//     const { arcConfig } = this.props;

//     return (
//       <Component key={entity.id} id={entity.id} arcConfig={arcConfig}>
//         {children}
//       </Component>
//     );
//   }

//   public static get Entities() {
//     return CreateContextFeed(
//       this._EntitiesContext.Consumer,
//       this._LogsContext.Consumer,
//       "Schemes"
//     );
//   }

//   public static get Logs() {
//     return CreateContextFeed(
//       this._LogsContext.Consumer,
//       this._LogsContext.Consumer,
//       "Schemes"
//     );
//   }

//   protected static _EntitiesContext = React.createContext<Entity[] | undefined>(
//     undefined
//   );
//   protected static _LogsContext = React.createContext<
//     ComponentListLogs | undefined
//   >(undefined);
// }

// class Schemes extends React.Component<RequiredProps> {
//   render() {
//     const { children, sort, filter } = this.props;

//     return (
//       <Protocol.Config>
//         {(arcConfig: ProtocolConfig) => (
//           <ArcSchemes arcConfig={arcConfig} sort={sort} filter={filter}>
//             {children}
//           </ArcSchemes>
//         )}
//       </Protocol.Config>
//     );
//   }

//   public static get Entities() {
//     return ArcSchemes.Entities;
//   }

//   public static get Logs() {
//     return ArcSchemes.Logs;
//   }
// }

// export default Schemes;

// export { ArcSchemes, Schemes };