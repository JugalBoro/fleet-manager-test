// "queries": [
//     {
//         "sample_size": 4865,
//         "results": [
//             {
//                 "name": "default\\urn:ngsi-ld:asset:2:13\\http://www.industry-fusion.org/fields#status",
//                 "group_by": [
//                     {
//                         "name": "type",
//                         "type": "number"
//                     }
//                 ],
//                 "tags": {
//                     "nodeType": [
//                         "@value"
//                     ],
//                     "type": [
//                         "https://uri.etsi.org/ngsi-ld/Property"
//                     ]
//                 },
//                 "values": []
//             },
//         ]
//     }
// ]

export interface KairosDBQueryDto {
  queries: Query[];
}

export interface Query {
  sample_size: number;
  results: QueryResult[];
}

export interface QueryResult {
  name: string;
  group_by: GroupBy[];
  tags: Tags;
  values: any[];
}

export interface GroupBy {
  name: string;
  type: string;
}

export interface Tags {
  nodeType: string[];
  type: QueryResult[];
}

export interface QueryResult {
  name: string;
  group_by: GroupBy[];
  tags: Tags;
  values: any[];
}
