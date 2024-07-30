import { ExternalScriptsFunction, ExternalScriptsHandle, ScriptDescriptor } from "remix-utils/external-scripts";

// interface AppHandle<LoaderData = unknown> {
// 	scripts?: ExternalScriptsFunction<LoaderData> | ScriptDescriptor[];
// }
// export let handle: AppHandle<LoaderData> = {
//   scripts({ id, data, params, matches, location, parentsData }) {
//     return [
//       {
//         src: "https://sandbox.web.squarecdn.com/v1/square.js",
//         type:"text/javascript"
//       }
//     ];
//   },
// };