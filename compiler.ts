import { Stmt, Expr, BinOp } from "./ast";
import { parse } from "./parser";

// https://learnxinyminutes.com/docs/wasm/

type LocalEnv = Map<string, boolean>;

type CompileResult = {
  wasmSource: string,
};

export function compile(source: string) : CompileResult {
  const ast = parse(source);
  ReferenceError(ast);

  const definedVars = new Set();
  ast.forEach(s => {
    switch(s.tag) {
      case "define":
        definedVars.add(s.name);
        break;
    }
  }); 
  const scratchVar : string = `(local $$last i32)`;
  const localDefines = [scratchVar];
  definedVars.forEach(v => {
    localDefines.push(`(local $${v} i32)`);
  })
  
  const commandGroups = ast.map((stmt) => codeGen(stmt));
  const commands = localDefines.concat([].concat.apply([], commandGroups));
  console.log("Generated: ", commands.join("\n"));
  return {
    wasmSource: commands.join("\n"),
  };
}

function codeGen(stmt: Stmt) : Array<string> {
  switch(stmt.tag) {
    case "define":
      var valStmts = codeGenExpr(stmt.value);
      return valStmts.concat([`(local.set $${stmt.name})`]);
    case "expr":
      var exprStmts = codeGenExpr(stmt.expr);
      return exprStmts.concat([`(local.set $$last)`]);
  }
}

function codeGenExpr(expr : Expr) : Array<string> {
  switch(expr.tag) {
    case "builtin1":
      const argStmts = codeGenExpr(expr.arg);
      return argStmts.concat([`(call $${expr.name})`]);
    case "builtin2":
      const arg1Stmts = codeGenExpr(expr.arg1);
      const arg2Stmts = codeGenExpr(expr.arg2); 
      return [...arg1Stmts,...arg2Stmts, `(call $${expr.name})`];
    case "num":
      return ["(i32.const " + expr.value + ")"];
    case "id":
      return [`(local.get $${expr.name})`];
    case "binexpr":
      const leftStmts = codeGenExpr(expr.left);
      const rightStmts= codeGenExpr(expr.right);
      const opStmts   = codeGenBinOp(expr.op);
      return [...leftStmts, ...rightStmts, opStmts];
  }
}

function codeGenBinOp(op: BinOp):string{
  switch (op){
    case BinOp.Plus:
      return "(i32.add)";
      break;
    case BinOp.Minus:
      return "(i32.sub)";
      break;
    case BinOp.Mul:
      return "(i32.mul)";
      break;
  }
}


function ReferenceError(ast: Stmt[]){
  const varArea = new Set<string> ();
  //ast.map(checkStmt)
  ast.forEach(s => {
    checkStmt(s, varArea);
  }); 
}

function checkStmt(State: Stmt, varArea: Set<string>){
  switch (State.tag){
    case "define":
      checkExpr(State.value,varArea);
      varArea.add(State.name);
      return;
    case "expr":
      checkExpr(State.expr,varArea);
      return;
  }
}

function checkExpr(expr: Expr, varArea: Set<string> ) {
  switch(expr.tag) {
    case "builtin1":
      checkExpr(expr.arg,varArea);
    return;
    case "builtin2":
      checkExpr(expr.arg1,varArea);
      checkExpr(expr.arg2,varArea);
    return;
    case "binexpr":
      checkExpr(expr.left,varArea);
      checkExpr(expr.right,varArea);
    return;
    case "id": 
      if(!varArea.has(expr.name)) {
      throw new Error("ReferenceError: undefined variable:" + expr.name);
    }
    return;
  }
}
  