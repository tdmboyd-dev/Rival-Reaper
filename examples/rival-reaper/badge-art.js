// Standalone reveal badges only. Roster posters never enter this registry.
// Blue/green await corrected, owner-approved names; obsolete originals excluded.
export const REVEAL_BADGES = {
  "blood-bloom":"/assets/blood-bloom-badge.png",
  "heat-mob":"/assets/heat-mob-badge.png",
  "pink-venom":"/assets/pink-venom-badge.png",
  "belt-2-ass":"/assets/belt-2-ass-badge.png",
};
export function createBadgeView(root, symbol, note, makeImage = () => new Image()) {
  let generation=0,last;
  return {
    show(world) {
      const id=world?.id ?? null;
      if(last===id)return;last=id;const current=++generation;
      root.replaceChildren();root.hidden=true;symbol.hidden=false;
      symbol.textContent=world?.symbol ?? "R";
      const source=REVEAL_BADGES[id];
      note.textContent=id ? (source ? "LOADING TEAM BADGE" : "BADGE ART PENDING") : "FATE LOCKED BEFORE REVEAL";
      if(!source)return;
      const image=makeImage();image.alt=`${world.name} standalone team badge`;image.decoding="async";
      image.onload=()=>{
        if(current!==generation)return;
        if(!image.naturalWidth||!image.naturalHeight){image.onerror();return;}
        root.replaceChildren(image);root.hidden=false;symbol.hidden=true;note.textContent="TEAM BADGE";
      };
      image.onerror=()=>{
        if(current!==generation)return;
        root.replaceChildren();root.hidden=true;symbol.hidden=false;note.textContent="BADGE UNAVAILABLE · FATE UNCHANGED";
      };
      image.src=source;
    },
  };
}
