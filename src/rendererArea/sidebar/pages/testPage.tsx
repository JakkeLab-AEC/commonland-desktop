import { ThreeExporter } from "../../../rendererArea/api/three/exporters/threeExporter"
import { SceneController } from "../../../rendererArea/api/three/SceneController"
import { ThreeBoringPost } from "../../../rendererArea/api/three/predefinedCreations/boringPost"
import { ButtonPositive } from "../../../rendererArea/components/buttons/buttonPositive"
import React from "react"
import { DXFWriter, Layer, Text, Line, Block, BlockInsert } from "../../../rendererArea/api/dxfwriter/dxfwriter"

export const TestPage = () => {
    const testAddPostSegment = async () => {
        // const geoSet = ThreeBoringPost.createPostSegmenet("테스트1", "10", 10, 1, false);
        // SceneController.getInstance().addObjects([geoSet.postMesh, geoSet.leaderLine, geoSet.textMesh]);
        // const leaderSet = await ThreeBoringPost.createLeader("Test", 0.5, 0x000000, {curved: false, leaderLength: 5}, 0.5, 1);
        // console.log(leaderSet.textMesh);
        // const leaderSet = await ThreeBoringPost.createLeader('테스트', 0.5, 0x000000, {curved: false, leaderLength: 5}, 0.5, 0);
        // const leaderSet = await ThreeBoringPost.createLeader('테스트', 0.5, 0x000000, {curved: true, leaderSegmentLength: [5, 5, 5]}, 0.5, 0);
        // console.log(leaderSet);
        // SceneController.getInstance().addObjects([leaderSet.leaderLine, leaderSet.textMesh]);

        const postSet = await ThreeBoringPost.createPostSegmenet('Test', '24.05', 5, 2, false);
        SceneController.getInstance().addObjects([postSet.leaderLine, postSet.postMesh, postSet.textMesh]);
    }

    const testDownloadScene = async () => {
        ThreeExporter.exportAsObjAndMtl();
    }

    const testDXFWriter = () => {
        DXFWriter.testNoEntityWithLayers();
    }

    const testDXFWriterWithEntity = () => {
        DXFWriter.testTextEntityWithLayers();
    }

    const testDXFWriterWithStyle = () => {

    }
    
    return (
        <div>
            <ButtonPositive text={"Test Post Segmenet"} isEnabled={true} onClickHandler={testAddPostSegment}/>
            <ButtonPositive text={"Download Scene OBJ"} isEnabled={true} onClickHandler={testDownloadScene}/>
            <ButtonPositive text={"Test DXF Export Empty"} isEnabled={true} onClickHandler={testDXFWriter}/>
            <ButtonPositive text={"Test DXF Export Text"} isEnabled={true} onClickHandler={testDXFWriterWithEntity}/>
        </div>
    )
}
