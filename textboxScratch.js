(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('Run this extension unsandboxed');
    }

    class TextInputExtension {
        constructor() {
            this.inputs = {};
        }

        getInfo() {
            return {
                id: 'textinputext',
                name: 'Text Inputs',
                blocks: [
                    {
                        opcode: 'createInput',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'create input id [ID] width [W] height [H] multiline [M] fontsize [FS] x [X] y [Y] placeholder [P]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' },
                            W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
                            H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
                            M: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: false },
                            FS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 16 },
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            P: { type: Scratch.ArgumentType.STRING, defaultValue: 'Type here...' }
                        }
                    },
                    {
                        opcode: 'getText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'input [ID] text',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' }
                        }
                    },
                    {
                        opcode: 'deleteInput',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete input [ID]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'input1' }
                        }
                    }
                ]
            };
        }

        getStageContainer() {
            const canvas = document.querySelector('canvas');
            return canvas ? canvas.parentElement : document.body;
        }

        createInput(args) {
            const id = args.ID;

            if (this.inputs[id]) {
                this.inputs[id].remove();
                delete this.inputs[id];
            }

            let element;

            if (args.M) {
                element = document.createElement('textarea');
            } else {
                element = document.createElement('input');
                element.type = 'text';
            }

            const container = this.getStageContainer();

            // Ensure proper positioning context
            container.style.position = 'relative';

            element.style.position = 'absolute';
            element.style.left = Number(args.X) + 'px';
            element.style.top = Number(args.Y) + 'px';
            element.style.width = args.W + 'px';
            element.style.height = args.H + 'px';
            element.style.fontSize = args.FS + 'px';
            element.style.zIndex = 9999;

            element.placeholder = args.P;

            // ✅ FIX: attach to stage instead of body
            container.appendChild(element);

            this.inputs[id] = element;
        }

        getText(args) {
            const el = this.inputs[args.ID];
            if (!el) return '';
            return el.value;
        }

        deleteInput(args) {
            const el = this.inputs[args.ID];
            if (el) {
                el.remove();
                delete this.inputs[args.ID];
            }
        }
    }

    Scratch.extensions.register(new TextInputExtension());

})(Scratch);
