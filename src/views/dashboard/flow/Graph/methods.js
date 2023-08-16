/* eslint-disable */
import "@antv/x6-vue-shape";
import { Graph, Shape, Addon, FunctionExt } from "@antv/x6";
// 拖拽生成四边形或者圆形
export const startDragToGraph = (graph, type, e, item) => {
  console.log(graph);
  let id = item.id;
  let node = null;
  if (type === "Rect") {
    node = graph.createNode({
      width: 100,
      height: 60,
      attrs: {
        label: {
          text: "正方形节点",
          fill: "#000000",
          fontSize: 14,
          textWrap: {
            width: -10,
            height: -10,
            ellipsis: true
          }
        },
        body: {
          stroke: "#000000",
          strokeWidth: 1,
          fill: "#ffffff"
        }
      },
      ports: ports
    });
  } else if (type === "Circle") {
    console.log(1);
    node = graph.createNode({
      operationCode: item.id,
      id: "111111",
      shape: "ellipse",
      width: 100,
      height: 100,
      attrs: {
        label: {
          text: item.label,
          fill: "#000000",
          fontSize: 14,
          textWrap: {
            width: -20,
            height: -10,
            ellipsis: true
          }
        },
        body: {
          stroke: "#000000",
          strokeWidth: 1,
          fill: "#ffffff"
        }
      },
      ports: ports
    });
  } else if (type === "polygon") {
    node = graph.createNode({
      shape: "polygon",
      x: 40,
      y: 40,
      width: 120,
      height: 120,
      attrs: {
        label: {
          text: "条件节点",
          fill: "#000000",
          fontSize: 14,
          textWrap: {
            width: -50,
            height: "70%",
            ellipsis: true
          }
        },
        body: {
          fill: "#ffffff",
          stroke: "#000000",
          refPoints: "0,10 10,0 20,10 10,20",
          strokeWidth: 1
        }
      },
      ports: ports
    });
  } else if (type === "TextBlock") {
    node = graph.createNode({
      shape: "text-block",
      width: 120,
      height: 40,
      text: "测试文本",
      attrs: {
        body: {
          stroke: "#000000",
          fill: "#ffffff",
          rx: 4,
          ry: 4,
          strokeWidth: 0.5
        }
      },
      ports: ports
    });
  }
  console.log(node);
  const dnd = new Addon.Dnd({ target: graph });
  dnd.start(node, e);
};
const ports = {
  groups: {
    // 输入链接桩群组定义
    top: {
      position: "top",
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#2D8CF0",
          strokeWidth: 2,
          fill: "#fff"
        }
      }
    },
    // 输出链接桩群组定义
    bottom: {
      position: "bottom",
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#2D8CF0",
          strokeWidth: 2,
          fill: "#fff"
        }
      }
    },
    left: {
      position: "left",
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#2D8CF0",
          strokeWidth: 2,
          fill: "#fff"
        }
      }
    },
    right: {
      position: "right",
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#2D8CF0",
          strokeWidth: 2,
          fill: "#fff"
        }
      }
    }
  },
  items: [
    {
      id: "port1",
      group: "top"
    },
    {
      id: "port2",
      group: "bottom"
    },
    {
      id: "port3",
      group: "left"
    },
    {
      id: "port4",
      group: "right"
    }
  ]
};
