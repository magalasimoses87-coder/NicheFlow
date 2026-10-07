// NicheFlow V4 RPG Engine

const NicheFlowRPG = {
  xp: 720,
  level: 5,

  addXP(amount) {
    this.xp += amount;
    this.checkLevel();
    return this.getStats();
  },

  checkLevel() {
    const required = this.level * 200;
    if (this.xp >= required) {
      this.level++;
      console.log("Level Up!");
    }
  },

  getStats() {
    return {
      level: this.level,
      xp: this.xp
    };
  }
};

export default NicheFlowRPG;