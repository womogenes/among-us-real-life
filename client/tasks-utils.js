import { TaskIcon } from './components/task-icon';

import { Marker } from 'react-native-maps';

export function taskMarkers(tasks, emergency) {
  return [tasks.map((item) => {
    let markerLabel = item.name + item.complete ? ' (Complete)' : '';

    return (
      <Marker
        tracksViewChanges={item.complete}
        key={item.taskId}
        coordinate={{
          latitude: item.location.latitude,
          longitude: item.location.longitude,
        }}
        title={markerLabel}
        zIndex={-1}
      >
        <TaskIcon
          name={item.name}
          complete={item.complete}
          size={60}
        ></TaskIcon>
      </Marker>
    );
  }),
  emergency.map((item) => {
    return (
      <Marker
        tracksViewChanges={item.complete}
        key={item.taskId}
        coordinate={{
          latitude: item.location.latitude,
          longitude: item.location.longitude,
        }}
        title={'EMERGENCY'}
        zIndex={-1}
      >
        <TaskIcon
          name={item.name}
          size={60}
        ></TaskIcon>
    </Marker>
    );
  })

  ];
}

export function completeTask(activeTask, setActiveTask, getGameRoom, sabotageActive) {
  const { name, taskId } = activeTask;
  closeTask(setActiveTask);

  // Mark task as complete
  console.log(`${name} task ${taskId} completed`);
  getGameRoom().send('completeTask', taskId, sabotageActive);
}

export function autoCompleteTask(task, getGameRoom) {
  getGameRoom().send('completeFakeTask', task.taskId);
}


export function closeTask(setActiveTask) {
  setActiveTask((prevArrState) => ({
    ...prevArrState,
    name: null,
    taskId: null,
  }));
}
