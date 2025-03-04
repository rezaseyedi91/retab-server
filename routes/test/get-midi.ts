import { Router } from "express";
import RetabDoc from "../../rez-mei/RetabDoc";
import { createReadStream, createWriteStream, readFileSync } from "node:fs";
import { getInstance, initVerovio } from "../../rez-mei/VerovioToolkitInstance";
//@ts-ignore
import * as midiParser  from 'midi-parser-js'
import { join } from "node:path";
const router = Router();

router.get('/:id', async (req, res) => {
  const midiData = readFileSync(join(__dirname, './some-midi.mid'))
    // const id = Number(req.params.id)
    // const retabDoc = await RetabDoc.getInstanceFromDb(id);
    // const mei = (await retabDoc?.toMei())!;
    // const verovio = await getInstance(); 
    // verovio.loadData(mei)
    // const midi = verovio.renderToMIDI();
    const mp = midiParser
    console.log(mp.parse(midiData))
    let midiArray = midiParser.parse(midiData);

console.log(`Tracks: ${midiArray.tracks}, TimeDivision: ${midiArray.timeDivision}`);
for(let i in midiArray.track) {
  console.log(`Track ${i}`);
  for(let j in midiArray.track[i].event) {
    let event = midiArray.track[i].event[j];
    switch(event.type) {
      // case 8: // note off
      case 9: // note on
      // case 11: // controller
      // case 12: // program change
        console.log(` ${j} \tt:${event.type}\t ch:${event.channel} delta:${event.deltaTime} \t- \t${event.data}`);
        break;
      case 255: // meta event
        // console.log(` ${j} \tt:${event.type} m:${event.metaType} delta:${event.deltaTime} \t- \t${event.data}`);
        break;
      default:
        // console.log(` ${j} \tt:${event.type} delta:${event.deltaTime} - ${event.data}`);
        break;
      }
  }
}
    return res.send('midiData')
})

export default router;